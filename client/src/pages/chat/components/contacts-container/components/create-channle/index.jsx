import React, { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FaPlus } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { getAllContactsAsync } from "@/features/contacts/contactsSlice";
import { addChannel } from "@/features/chat/chatSlice";
import { createChannelAsync } from "@/features/channels/channelSlice";

function CreateChannel() {
  const dispatch = useDispatch();
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [channelName, setChannelName] = useState("");

  

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await dispatch(getAllContactsAsync()).unwrap();
        if (response.statusCode === 200) {
          setAllContacts(response.data.contacts);
        } else {
          setAllContacts([]);
        }
      } catch (error) {
        toast.error("Failed to load contacts");
      }
    };
    getData();
  }, [dispatch]);

  const createChannel = async () => {
    if (!channelName || selectedContacts.length === 0) {
      toast.error("Channel name and contacts are required");
      return;
    }
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const name = channelName;
        const members = selectedContacts.map((contact) => contact.value);

        const response = await dispatch(createChannelAsync({ name, members })).unwrap();

        if (response.statusCode === 200) {
          toast.success("Channel created successfully");
          setNewChannelModal(false);
          setChannelName("");
          setSelectedContacts([]);
          dispatch(addChannel(response.data.channel));
        } else {
          toast.error("Failed to create channel");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-500 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setNewChannelModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Please fill up the details for new channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
          </div>
          <div>
            <Select
              id="contact"
              name="contact"
              value={selectedContacts}
              onChange={setSelectedContacts}
              options={allContacts.map((contact) => ({
                value: contact.value,
                label: contact.label,
              }))}
              isMulti
              className="rounded-lg border-none py-1 text-black bg-[#2c2e3b]"
              classNamePrefix="react-select"
              placeholder="Search Contacts"
              required
            />
          </div>
          <div className="mt-auto">
            <Button
              className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateChannel;
